import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  ilike,
  lt,
  or,
  type SQL,
} from "drizzle-orm";
import { type PgColumn, type PgTable } from "drizzle-orm/pg-core";
import z from "zod";

export function calculateOffset(page: number, perPage: number): number {
  return (page - 1) * perPage;
}

export function calculateTotalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}

export function buildPaginatedResponse<T>(params: {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
}): PaginatedResponse<T> {
  return {
    items: params.items,
    page: params.page,
    perPage: params.perPage,
    totalItems: params.totalItems,
    totalPages: calculateTotalPages(params.totalItems, params.perPage),
    status: "success",
  };
}

export function buildOrderBy(params: {
  sortBy?: string;
  sortOrder: "asc" | "desc";
  columnMap: Record<string, PgColumn>;
  defaultColumn: PgColumn;
}): SQL {
  const { sortBy, sortOrder, columnMap, defaultColumn } = params;
  const column = sortBy && columnMap[sortBy] ? columnMap[sortBy] : defaultColumn;
  return sortOrder === "desc" ? desc(column) : asc(column);
}

export type InferSelectModel<T extends PgTable> = T["$inferSelect"];
export type InferInsertModel<T extends PgTable> = T["$inferInsert"];
export type TableColumns<T extends PgTable> = keyof T["$inferSelect"] & string;

export interface WhereClause {
  conditions: (SQL | undefined)[];
  operator: "and" | "or";
}

export interface ListPagedParams<TTable extends PgTable = PgTable> {
  page?: number;
  perPage?: number;
  sortBy?: TableColumns<TTable>;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  searchOn?: TableColumns<TTable>[];
  where?: WhereClause;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  status: "success";
}

export interface CursorPaginationParams<TTable extends PgTable = PgTable> {
  cursor?: string;
  limit?: number;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  searchOn?: TableColumns<TTable>[];
  where?: WhereClause;
}

export interface InfinitePaginationResponse<T> {
  items: T[];
  nextCursor?: string;
  hasNextPage: boolean;
}

export class SimpleQueryEngine<
  TTable extends PgTable = PgTable,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  private db: NodePgDatabase;
  private table: TTable;
  private columns: Record<string, PgColumn>;

  constructor(db: NodePgDatabase, table: TTable) {
    this.db = db;
    this.table = table;
    this.columns = getTableColumns(table);
  }

  private combineWhereConditions(whereClause?: WhereClause): SQL | undefined {
    if (!whereClause || whereClause.conditions.length === 0) {
      return undefined;
    }

    const validConditions = whereClause.conditions.filter(
      (cond): cond is SQL => cond !== undefined,
    );

    if (validConditions.length === 0) {
      return undefined;
    }

    return whereClause.operator === "or" ? or(...validConditions) : and(...validConditions);
  }

  async listPaged(params: ListPagedParams<TTable> = {}): Promise<PaginatedResponse<TSelect>> {
    const {
      page = 1,
      perPage = 30,
      sortBy,
      sortOrder = "asc",
      searchTerm,
      searchOn,
      where,
    } = params;

    const offset = calculateOffset(page, perPage);

    const whereCondition = this.combineWhereConditions(where);

    const countQuery = this.db
      .select({ count: count() })
      .from(this.table as never);

    const [{ count: totalItems }] = whereCondition
      ? await countQuery.where(whereCondition)
      : await countQuery;

    let query = this.db
      .select()
      .from(this.table as never)
      .limit(perPage)
      .offset(offset);

    if (sortBy && this.columns[sortBy]) {
      const column = this.columns[sortBy];
      query = query.orderBy(sortOrder === "desc" ? desc(column) : asc(column)) as typeof query;
    }

    const allConditions: (SQL | undefined)[] = [];

    if (whereCondition) {
      allConditions.push(whereCondition);
    }

    if (searchTerm && searchOn && searchOn.length > 0) {
      const searchConditions = searchOn
        .map((col) => {
          const column = this.columns[col];
          if (column) {
            return ilike(column, `%${searchTerm}%`);
          }
          return null;
        })
        .filter((cond): cond is ReturnType<typeof ilike> => cond !== null);
      if (searchConditions.length > 0) {
        allConditions.push(or(...searchConditions));
      }
    }

    if (allConditions.length > 0) {
      const validConditions = allConditions.filter((cond): cond is SQL => cond !== undefined);
      if (validConditions.length > 0) {
        query = query.where(and(...validConditions)) as typeof query;
      }
    }

    const items = await query;

    return buildPaginatedResponse({
      items: items as TSelect[],
      page,
      perPage,
      totalItems,
    });
  }

  async listInfinite(
    params: CursorPaginationParams<TTable> = {},
  ): Promise<InfinitePaginationResponse<TSelect>> {
    const { cursor, limit = 20, sortOrder = "desc", searchTerm, searchOn, where } = params;

    const createdAtColumn = this.columns["createdAt"];
    const idColumn = this.columns["id"];

    if (!createdAtColumn || !idColumn) {
      throw new Error("Table must have 'createdAt' and 'id' columns for cursor pagination");
    }

    const whereCondition = this.combineWhereConditions(where);

    let query = this.db
      .select()
      .from(this.table as never)
      .limit(limit + 1);

    const buildAllConditions = (): SQL | undefined => {
      const allConditions: (SQL | undefined)[] = [];

      if (whereCondition) {
        allConditions.push(whereCondition);
      }

      if (searchTerm && searchOn && searchOn.length > 0) {
        const searchConditions = searchOn
          .map((col) => {
            const column = this.columns[col];
            if (column) {
              return ilike(column, `%${searchTerm}%`);
            }
            return null;
          })
          .filter((cond): cond is ReturnType<typeof ilike> => cond !== null);

        if (searchConditions.length > 0) {
          allConditions.push(or(...searchConditions));
        }
      }

      const validConditions = allConditions.filter((cond): cond is SQL => cond !== undefined);
      return validConditions.length > 0 ? and(...validConditions) : undefined;
    };

    if (cursor) {
      try {
        const { createdAt, id } = JSON.parse(cursor);
        const cursorDate = new Date(createdAt);

        const baseConditions = buildAllConditions();

        if (sortOrder === "desc") {
          const cursorCondition = or(
            lt(createdAtColumn, cursorDate),
            and(eq(createdAtColumn, cursorDate), lt(idColumn, id)),
          );

          query = baseConditions
            ? (query.where(and(baseConditions, cursorCondition)) as typeof query)
            : (query.where(cursorCondition) as typeof query);
        } else {
          const cursorCondition = or(
            gt(createdAtColumn, cursorDate),
            and(eq(createdAtColumn, cursorDate), gt(idColumn, id)),
          );

          query = baseConditions
            ? (query.where(and(baseConditions, cursorCondition)) as typeof query)
            : (query.where(cursorCondition) as typeof query);
        }
      } catch {
        throw new Error("Invalid cursor format");
      }
    } else {
      const baseConditions = buildAllConditions();
      if (baseConditions) {
        query = query.where(baseConditions) as typeof query;
      }
    }

    query = query.orderBy(
      sortOrder === "desc" ? desc(createdAtColumn) : asc(createdAtColumn),
      sortOrder === "desc" ? desc(idColumn) : asc(idColumn),
    ) as typeof query;

    const items = await query;

    const hasNextPage = items.length > limit;
    const displayItems = items.slice(0, limit);

    let nextCursor: string | undefined;
    if (hasNextPage && displayItems.length > 0) {
      const lastItem = displayItems[displayItems.length - 1] as Record<string, unknown>;
      nextCursor = JSON.stringify({
        createdAt: lastItem.createdAt,
        id: lastItem.id,
      });
    }

    return {
      items: displayItems as TSelect[],
      nextCursor,
      hasNextPage,
    };
  }

  async getOne(id: string): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;

    const [result] = await this.db
      .select()
      .from(this.table as never)
      .where(eq(idColumn, id))
      .limit(1);

    return (result as TSelect) || null;
  }

  async create(data: TInsert): Promise<TSelect> {
    const [result] = await this.db
      .insert(this.table)
      .values(data as never)
      .returning();
    return result as TSelect;
  }

  async update(id: string, data: Partial<TInsert>): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;

    const [result] = await this.db
      .update(this.table)
      .set(data as never)
      .where(eq(idColumn, id))
      .returning();

    return (result as TSelect) || null;
  }

  async delete(id: string): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;

    const [result] = await this.db
      .delete(this.table)
      .where(eq(idColumn, id))
      .returning();

    return (result as TSelect) || null;
  }

  async count(): Promise<number> {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(this.table as never);
    return total;
  }
}

export function createSimpleQueryEngine<TTable extends PgTable>(
  db: NodePgDatabase,
  table: TTable,
) {
  return new SimpleQueryEngine(db, table);
}

export const listQueryParamsSchema = z.object({
  searchTerm: z.string().optional(),
  searchOn: z.array(z.string()).optional(),
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(30),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

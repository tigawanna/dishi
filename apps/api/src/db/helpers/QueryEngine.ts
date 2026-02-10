import { db } from "@backend/db/client";
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

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

/**
 * Calculate the offset for database queries based on page and perPage
 */
export function calculateOffset(page: number, perPage: number): number {
  return (page - 1) * perPage;
}

/**
 * Calculate the total number of pages based on total items and items per page
 */
export function calculateTotalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}

/**
 * Build a paginated response object with all metadata
 */
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

/**
 * Build an order by clause for sorting with support for dynamic columns
 * @param sortBy - The field name to sort by
 * @param sortOrder - The sort direction ('asc' or 'desc')
 * @param columnMap - Object mapping field names to PgColumn instances
 * @param defaultColumn - Default column to sort by if sortBy doesn't match any key
 * @returns SQL sorting clause
 */
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

// ============================================================================
// TYPES
// ============================================================================

export type InferSelectModel<T extends PgTable> = T["$inferSelect"];
export type InferInsertModel<T extends PgTable> = T["$inferInsert"];
export type TableColumns<T extends PgTable> = keyof T["$inferSelect"] & string;

/**
 * Where clause configuration that can wrap conditions in either `or` or `and` expressions
 */
export interface WhereClause {
  /** Array of SQL conditions to apply */
  conditions: (SQL | undefined)[];
  /** How to combine the conditions - 'and' (all must match) or 'or' (any can match) */
  operator: "and" | "or";
}

export interface ListPagedParams<TTable extends PgTable = PgTable> {
  page?: number;
  perPage?: number;
  sortBy?: TableColumns<TTable>;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  searchOn?: TableColumns<TTable>[];
  /** Optional where clauses that can be combined with 'and' or 'or' */
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
  cursor?: string; // JSON.stringify({ createdAt: Date, id: string })
  limit?: number;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  searchOn?: TableColumns<TTable>[];
  /** Optional where clauses that can be combined with 'and' or 'or' */
  where?: WhereClause;
}

export interface InfinitePaginationResponse<T> {
  items: T[];
  nextCursor?: string;
  hasNextPage: boolean;
}

// ============================================================================
// SIMPLE QUERY ENGINE
// ============================================================================

export class SimpleQueryEngine<
  TTable extends PgTable = PgTable,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  private table: TTable;
  private columns: Record<string, PgColumn>;

  constructor(table: TTable) {
    this.table = table;
    this.columns = getTableColumns(table);
  }

  /**
   * Combine where clause conditions based on the operator
   */
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

  /**
   * Get paginated list with offset-based pagination
   */
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

    // Build where condition from optional where clause
    const whereCondition = this.combineWhereConditions(where);

    // Get total count (with where condition if provided)
    const countQuery = db
      .select({ count: count() })
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table);

    const [{ count: totalItems }] = whereCondition
      ? await countQuery.where(whereCondition)
      : await countQuery;

    // Build query with optional sorting
    let query = db
      .select()
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .limit(perPage)
      .offset(offset);

    if (sortBy && this.columns[sortBy]) {
      const column = this.columns[sortBy];
      query = query.orderBy(sortOrder === "desc" ? desc(column) : asc(column)) as typeof query;
    }

    // Build combined conditions (search + where clause)
    const allConditions: (SQL | undefined)[] = [];

    // Add where clause condition
    if (whereCondition) {
      allConditions.push(whereCondition);
    }

    // Add search conditions
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

    // Apply combined conditions
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

  /**
   * Get infinite scroll list using cursor-based pagination (createdAt + id)
   * Best for infinite scroll / "load more" patterns
   */
  async listInfinite(
    params: CursorPaginationParams<TTable> = {},
  ): Promise<InfinitePaginationResponse<TSelect>> {
    const { cursor, limit = 20, sortOrder = "desc", searchTerm, searchOn, where } = params;

    const createdAtColumn = this.columns["createdAt"];
    const idColumn = this.columns["id"];

    if (!createdAtColumn || !idColumn) {
      throw new Error("Table must have 'createdAt' and 'id' columns for cursor pagination");
    }

    // Build where condition from optional where clause
    const whereCondition = this.combineWhereConditions(where);

    // Fetch limit + 1 to determine if there are more items
    let query = db
      .select()
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .limit(limit + 1);

    // Build all conditions to combine
    const buildAllConditions = (): SQL | undefined => {
      const allConditions: (SQL | undefined)[] = [];

      // Add custom where clause condition
      if (whereCondition) {
        allConditions.push(whereCondition);
      }

      // Add search conditions
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

    // Apply cursor filter if provided
    if (cursor) {
      try {
        const { createdAt, id } = JSON.parse(cursor);
        const cursorDate = new Date(createdAt);

        const baseConditions = buildAllConditions();

        if (sortOrder === "desc") {
          // For descending: get items created before cursor, or same time but lower id
          const cursorCondition = or(
            lt(createdAtColumn, cursorDate),
            and(eq(createdAtColumn, cursorDate), lt(idColumn, id)),
          );

          query = baseConditions
            ? (query.where(and(baseConditions, cursorCondition)) as typeof query)
            : (query.where(cursorCondition) as typeof query);
        } else {
          // For ascending: get items created after cursor, or same time but higher id
          const cursorCondition = or(
            gt(createdAtColumn, cursorDate),
            and(eq(createdAtColumn, cursorDate), gt(idColumn, id)),
          );

          query = baseConditions
            ? (query.where(and(baseConditions, cursorCondition)) as typeof query)
            : (query.where(cursorCondition) as typeof query);
        }
      } catch (e) {
        throw new Error("Invalid cursor format");
      }
    } else {
      // No cursor - just apply base conditions
      const baseConditions = buildAllConditions();
      if (baseConditions) {
        query = query.where(baseConditions) as typeof query;
      }
    }

    // Sort by createdAt (and id as tiebreaker)
    query = query.orderBy(
      sortOrder === "desc" ? desc(createdAtColumn) : asc(createdAtColumn),
      sortOrder === "desc" ? desc(idColumn) : asc(idColumn),
    ) as typeof query;

    const items = await query;

    // Check if there are more items
    const hasNextPage = items.length > limit;
    const displayItems = items.slice(0, limit);

    // Generate next cursor from last item
    let nextCursor: string | undefined;
    if (hasNextPage && displayItems.length > 0) {
      const lastItem = displayItems[displayItems.length - 1] as any;
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

  /**
   * Get single record by ID
   */
  async getOne(id: string): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;

    const [result] = await db
      .select()
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    return (result as TSelect) || null;
  }

  /**
   * Create a new record
   */
  async create(data: TInsert): Promise<TSelect> {
    const [result] = await db
      .insert(this.table)
      .values(data as any)
      .returning();
    return result as TSelect;
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<TInsert>): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;
    // @ts-expect-error - Drizzle generic type inference issue with PgTable
    const [result] = await db
      .update(this.table)
      .set(data as any)
      .where(eq(idColumn, id))
      .returning();

    return (result as TSelect) || null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<TSelect | null> {
    const idColumn = this.columns["id"];
    if (!idColumn) return null;

    const [result] = await db.delete(this.table).where(eq(idColumn, id)).returning();

    return (result as TSelect) || null;
  }

  /**
   * Count all records
   */
  async count(): Promise<number> {
    // @ts-expect-error - Drizzle generic type inference issue with PgTable
    const [{ count: total }] = await db.select({ count: count() }).from(this.table);
    return total;
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createSimpleQueryEngine<TTable extends PgTable>(table: TTable) {
  return new SimpleQueryEngine(table);
}

export const listQueryParamsSchema = z.object({
  searchTerm: z.string().optional(),
  searchOn: z.array(z.string()).optional(),
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(30),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

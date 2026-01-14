import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const vehicleService = {
  // ============ VEHICLES ============

  /**
   * Get all vehicles
   */
  async getAll(options?: QueryOptions) {
    return await supabaseApi.getAll('vehicles', options)
  },

  /**
   * Get vehicle by ID
   */
  async getById(id: string) {
    return await supabaseApi.query('vehicles')
      .select(`
        *,
        driver:users!vehicles_driver_id_fkey (*)
      `)
      .eq('id', id)
      .single()
  },

  /**
   * Create vehicle
   */
  async create(data: Partial<TablesInsert<'vehicles'>>) {
    return await supabaseApi.create('vehicles', data)
  },

  /**
   * Update vehicle
   */
  async update(id: string, data: Partial<TablesUpdate<'vehicles'>>) {
    return await supabaseApi.update('vehicles', id, data)
  },

  /**
   * Delete vehicle (soft delete)
   */
  async delete(id: string) {
    return await supabaseApi.update('vehicles', id, { isActive: false })
  },

  // ============ ROUTES ============

  /**
   * Get all routes
   */
  async getAllRoutes(options?: QueryOptions) {
    return await supabaseApi.getAll('routes', options)
  },

  /**
   * Get route by ID with stops
   */
  async getRouteById(id: string) {
    return await supabaseApi.query('routes')
      .select(`
        *,
        vehicles (*),
        route_stops (*)
      `)
      .eq('id', id)
      .single()
  },

  /**
   * Create route
   */
  async createRoute(data: Partial<TablesInsert<'routes'>>) {
    return await supabaseApi.create('routes', data)
  },

  /**
   * Update route
   */
  async updateRoute(id: string, data: Partial<TablesUpdate<'routes'>>) {
    return await supabaseApi.update('routes', id, data)
  },

  // ============ ROUTE STOPS ============

  /**
   * Add stop to route
   */
  async addStop(data: Partial<TablesInsert<'route_stops'>>) {
    return await supabaseApi.create('route_stops', data)
  },

  /**
   * Update stop
   */
  async updateStop(id: string, data: Partial<TablesUpdate<'route_stops'>>) {
    return await supabaseApi.update('route_stops', id, data)
  },

  /**
   * Delete stop
   */
  async deleteStop(id: string) {
    return await supabaseApi.delete('route_stops', id)
  },

  // ============ STUDENT ASSIGNMENTS ============

  /**
   * Assign student to route
   */
  async assignStudent(data: Partial<TablesInsert<'student_route_assignments'>>) {
    return await supabaseApi.create('student_route_assignments', data)
  },

  /**
   * Get students on route
   */
  async getRouteStudents(routeId: string) {
    return await supabaseApi.query('student_route_assignments')
      .select(`
        *,
        students (
          *,
          users (*)
        ),
        route_stops (*)
      `)
      .eq('route_id', routeId)
      .eq('is_active', true)
  }
}

export default vehicleService

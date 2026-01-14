import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export const canteenService = {
  // ============ PRODUCTS ============
  
  /**
   * Get all products
   */
  async getAllProducts(options?: QueryOptions) {
    return await supabaseApi.getAll('canteen_products', options)
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    return await supabaseApi.getById('canteen_products', id)
  },

  /**
   * Create new product
   */
  async createProduct(data: Partial<TablesInsert<'canteen_products'>>) {
    return await supabaseApi.create('canteen_products', data)
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: Partial<TablesUpdate<'canteen_products'>>) {
    return await supabaseApi.update('canteen_products', id, data)
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    return await supabaseApi.update('canteen_products', id, { isActive: false })
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('canteen_products', {
      ...options,
      filters: { categoryId, isAvailable: true, isActive: true }
    })
  },

  /**
   * Update product stock
   */
  async updateStock(productId: string, quantity: number) {
    const product = await this.getProductById(productId)
    
    if (product.success && product.data) {
      const currentStock = product.data.stock || 0
      return await this.updateProduct(productId, {
        stock: currentStock + quantity
      })
    }
    
    return { success: false, message: 'Product not found' }
  },

  // ============ CATEGORIES ============

  /**
   * Get all categories
   */
  async getAllCategories(options?: QueryOptions) {
    return await supabaseApi.getAll('canteen_categories', options)
  },

  /**
   * Create category
   */
  async createCategory(data: Partial<TablesInsert<'canteen_categories'>>) {
    return await supabaseApi.create('canteen_categories', data)
  },

  /**
   * Update category
   */
  async updateCategory(id: string, data: Partial<TablesUpdate<'canteen_categories'>>) {
    return await supabaseApi.update('canteen_categories', id, data)
  },

  // ============ ORDERS ============

  /**
   * Get all orders
   */
  async getAllOrders(options?: QueryOptions) {
    return await supabaseApi.getAll('canteen_orders', options)
  },

  /**
   * Get order by ID with items
   */
  async getOrderById(id: string) {
    const result = await supabaseApi.query('canteen_orders')
      .select(`
        *,
        canteen_order_items (
          *,
          canteen_products (*)
        ),
        students (
          *,
          users (*)
        )
      `)
      .eq('id', id)
      .single()

    return result
  },

  /**
   * Create new order
   */
  async createOrder(orderData: {
    studentId: string
    semesterId: string
    items: Array<{
      productId: string
      quantity: number
      priceAtOrder: number
    }>
  }) {
    // Calculate total amount
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + (item.priceAtOrder * item.quantity),
      0
    )

    // Create order
    const orderResult = await supabaseApi.create('canteen_orders', {
      studentId: orderData.studentId,
      semesterId: orderData.semesterId,
      totalAmount,
      status: 'pending'
    })

    if (!orderResult.success || !orderResult.data) {
      return orderResult
    }

    // Create order items
    const orderItemsPromises = orderData.items.map(item =>
      supabaseApi.create('canteen_order_items', {
        orderId: orderResult.data.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder
      })
    )

    await Promise.all(orderItemsPromises)

    return orderResult
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    const updateData: any = { status }
    
    if (status === 'completed') {
      updateData.completedAt = new Date().toISOString()
    }

    return await supabaseApi.update('canteen_orders', orderId, updateData)
  },

  /**
   * Get orders by student
   */
  async getOrdersByStudent(studentId: string, options?: QueryOptions) {
    return await supabaseApi.getAll('canteen_orders', {
      ...options,
      filters: { studentId },
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  },

  /**
   * Process order payment (deduct from balance)
   */
  async processOrderPayment(orderId: string) {
    const orderResult = await this.getOrderById(orderId)
    
    if (!orderResult.data) {
      return { success: false, message: 'Order not found' }
    }

    const order = orderResult.data
    const studentId = order.student_id
    const amount = order.total_amount

    // Get student balance
    const balanceResult = await supabaseApi.query('student_balances')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (!balanceResult.data || balanceResult.data.balance < amount) {
      return { success: false, message: 'Insufficient balance' }
    }

    // Deduct from balance
    await supabaseApi.update('student_balances', studentId, {
      balance: balanceResult.data.balance - amount
    })

    // Create transaction record
    await supabaseApi.create('canteen_transactions', {
      studentId,
      canteenUserId: null, // TODO: Get from auth context
      semesterId: order.semester_id,
      amount: -amount
    })

    // Update order status
    return await this.updateOrderStatus(orderId, 'completed')
  }
}

export default canteenService

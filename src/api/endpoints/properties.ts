// C:\laragon\www\Semsary\src\api\endpoints\properties.ts
import api from "@services/axios-global";
import {
  Property,
  ApiResponse,
  PaginatedResponse,
  User,
  PropertyImage,
  Agent,
} from "@app-types/admin/admin";

// Enhanced Property interface with additional admin fields
export interface AdminProperty extends Property {
  owner: User;
  images: PropertyImage[];
  verification_status: 'Pending' | 'Approved' | 'Rejected';
  verification_notes?: string;
  rejection_reason?: string;
  assigned_cs_agent_details?: Agent; // Add this line instead
  assignment?: {
    is_assigned: boolean;
    status: string | null;
    agent?: {
      id: number;
      name: string;
      email: string;
    };
    assignment_id?: number;
    assigned_at?: string;
  };
  fraud_risk_score: 'Low Risk' | 'Medium Risk' | 'High Risk';
  submitted_date: string;
  last_updated: string;
  documents_count: number;
  reviews_count?: number;
  bookings_count?: number;
  featured: boolean;
}

// PropertyImage now imported from admin types

interface PropertyStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  monthly_additions: Array<{
    month: string;
    count: number;
  }>;
  top_owners: Array<{
    owner: User;
    properties_count: number;
  }>;
}

interface BulkOperationResponse {
  success_count: number;
  failed_count: number;
  failed_properties?: Array<{
    id: number;
    error: string;
  }>;
  message: string;
}

// Helper function to normalize status values
const normalizeStatus = (status: string): 'Valid' | 'Invalid' | 'Pending' | 'Rented' | 'Sold' => {
    const statusMap: Record<string, 'Valid' | 'Invalid' | 'Pending' | 'Rented' | 'Sold'> = {
      'pending': 'Pending',
      'valid': 'Valid', 
      'approved': 'Valid',
      'invalid': 'Invalid',
      'rejected': 'Invalid',
      'rented': 'Rented',
      'sold': 'Sold'
    };
    
    return statusMap[status.toLowerCase()] || 'Pending';
  };

// Safe helper function to create URLSearchParams
const createSearchParams = (obj: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else {
      params.append(key, String(value));
    }
  });
  
  return params;
};

export const propertiesApi = {
  // Get all properties with comprehensive filtering
  getProperties: async (
    page: number = 1,
    limit: number = 15,
    filters?: any
  ): Promise<PaginatedResponse<AdminProperty>> => {
    try {
      const params = createSearchParams({
        page: page.toString(),
        per_page: limit.toString(),
        ...filters,
      });

      const response = await api.get(`/admin/properties?${params}`);
      
      
      // Handle different possible response structures
      let backendData, properties, pagination;
      
      if (response.data.data) {
        backendData = response.data.data;
        properties = backendData.properties || backendData || [];
        pagination = backendData.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: properties.length
        };
      } else if (response.data.properties) {
        properties = response.data.properties;
        pagination = response.data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: properties.length
        };
      } else if (Array.isArray(response.data)) {
        properties = response.data;
        pagination = {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: properties.length
        };
      } else {
        console.warn('Unexpected response structure:', response.data);
        properties = [];
        pagination = {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: 0
        };
      }

      // Transform backend properties to frontend format
      const transformedProperties = properties.map((property: any) => {
        try {
          return {
            id: property.id,
            owner_id: property.owner?.id || 0,
            title: property.title || 'Untitled Property',
            description: property.description || '',
            type: property.type || 'Unknown',
            property_state: normalizeStatus(property.status || property.property_state || 'Pending'),
            status: property.property_status || 'rent',
            price: property.price?.amount || property.price || '0',
            price_type: property.price?.type || property.price_type || 'monthly',
            bedrooms: property.specifications?.bedrooms || property.bedrooms || 0,
            bathrooms: property.specifications?.bathrooms || property.bathrooms || 0,
            size: property.specifications?.size || property.size || 0,
            created_at: property.created_at || new Date().toISOString(),
            updated_at: property.updated_at || new Date().toISOString(),
            is_in_wishlist: property.is_in_wishlist || false,
            transactions_count: property.transactions_count || 0,
            location: {
              address: property.location?.address || '',
              city: property.location?.city || '',
              state: property.location?.state || '',
              latitude: property.location?.coordinates?.lat || property.location?.latitude || 0,
              longitude: property.location?.coordinates?.lng || property.location?.longitude || 0,
            },
            owner: {
              id: property.owner?.id || 0,
              first_name: property.owner?.name?.split(' ')[0] || property.owner?.first_name || 'Unknown',
              last_name: property.owner?.name?.split(' ').slice(1).join(' ') || property.owner?.last_name || '',
              email: property.owner?.email || '',
              google_id: null,
              email_verified_at: null,
              email_otp: null,
              email_otp_expires_at: null,
              phone_number: property.owner?.phone || property.owner?.phone_number || '',
              role: 'owner' as const,
              phone_verified_at: null,
              whatsapp_otp: null,
              whatsapp_otp_expires_at: null,
              status: property.owner?.status || 'active',
              created_at: property.owner?.joined_date || property.owner?.created_at || new Date().toISOString(),
              updated_at: property.owner?.updated_at || new Date().toISOString(),
              id_image_url: property.owner?.avatar || property.owner?.id_image_url || null,
            },
            images: property.images?.count > 0 ? [{ 
              id: 1, 
              url: property.images.primary_image || property.images[0]?.url || '', 
              is_primary: true 
            }] : [],
            fraud_risk_score: property.admin_info?.requires_attention ? 'High Risk' : 
                            property.fraud_risk_score || 'Low Risk',
            submitted_date: property.created_at || new Date().toISOString(),
            last_updated: property.updated_at || new Date().toISOString(),
            documents_count: property.documents_count || 0,
            reviews_count: property.statistics?.reviews_count || property.reviews_count || 0,
            bookings_count: property.statistics?.bookings_count || property.bookings_count || 0,
            featured: property.featured || false,
            verification_status: property.verification_status || 'Pending',
            assignment: property.assignment || null,
          };
        } catch (transformError) {
          console.error('Error transforming property:', property, transformError);
          return {
            id: property.id || 0,
            owner_id: 0,
            title: 'Error Loading Property',
            description: '',
            type: 'Unknown',
            property_state: 'Pending',
            status: 'rent',
            price: '0',
            price_type: 'monthly',
            bedrooms: 0,
            bathrooms: 0,
            size: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_in_wishlist: false,
            transactions_count: 0,
            location: { address: '', city: '', state: '', latitude: 0, longitude: 0 },
            owner: {
              id: 0,
              first_name: 'Unknown',
              last_name: '',
              email: '',
              google_id: null,
              email_verified_at: null,
              email_otp: null,
              email_otp_expires_at: null,
              phone_number: '',
              role: 'owner' as const,
              phone_verified_at: null,
              whatsapp_otp: null,
              whatsapp_otp_expires_at: null,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              id_image_url: null,
            },
            images: [],
            fraud_risk_score: 'Low Risk' as const,
            submitted_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            documents_count: 0,
            reviews_count: 0,
            bookings_count: 0,
            featured: false,
            verification_status: 'Pending' as const,
            assignment: null,
          };
        }
      });


      return {
        data: transformedProperties,
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        per_page: pagination.per_page,
        total: pagination.total,
        from: ((pagination.current_page - 1) * pagination.per_page) + 1,
        to: Math.min(pagination.current_page * pagination.per_page, pagination.total),
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Get single property with full admin details
  getProperty: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/admin/properties/${id}`);
      
      
      // Return the raw response data as it comes from the API
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  // Get property statistics for dashboard - FIXED FOR YOUR API
  getStatistics: async (): Promise<PropertyStatistics> => {
    try {
      
      const response = await api.get('/admin/properties/statistics');
      
      // Extract data from your API response structure
      const apiData = response.data.data;
      
      if (!apiData) {
        console.error('No data found in statistics response');
        throw new Error('No data in statistics response');
      }
      
      // Map your API response to the expected format
      const mappedStats = {
        total: apiData.total_properties || 0,
        pending: apiData.pending_approval || apiData.by_status?.Pending || 0,
        approved: apiData.by_status?.Valid || 0,
        rejected: apiData.by_status?.Invalid || 0,
        by_type: apiData.by_type || {},
        by_status: apiData.by_status || {},
        monthly_additions: Object.entries(apiData.monthly_additions || {}).map(([month, count]) => ({
          month,
          count: count as number
        })),
        top_owners: (apiData.top_owners || []).map((owner: any) => ({
          owner: {
            id: owner.id,
            first_name: owner.name?.split(' ')[0] || 'Unknown',
            last_name: owner.name?.split(' ').slice(1).join(' ') || '',
            email: owner.email || '',
            google_id: null,
            email_verified_at: null,
            email_otp: null,
            email_otp_expires_at: null,
            phone_number: '',
            role: 'owner' as const,
            phone_verified_at: null,
            whatsapp_otp: null,
            whatsapp_otp_expires_at: null,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id_image_url: null,
          },
          properties_count: owner.properties_count || 0
        }))
      };
      
      
      
      return mappedStats;
      
    } catch (error) {
      console.error('Statistics fetch failed:', error);
      
      // Return zeros on error so the UI shows empty state rather than crashing
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        by_type: {},
        by_status: {},
        monthly_additions: [],
        top_owners: []
      };
    }
  },

  // Update property status with notification support
  updatePropertyStatus: async (
    id: number, 
    status: 'Valid' | 'Invalid' | 'Pending' | 'Rented' | 'Sold',
    data: {
      reason?: string;
      notify_owner?: boolean;
      internal_notes?: string;
    }
  ): Promise<AdminProperty> => {
    const response = await api.post<ApiResponse<AdminProperty>>(
      `/admin/properties/${id}/status`,
      {
        status,
        ...data,
      }
    );
    return response.data.data;
  },

  // Assign property to CS agent - Updated to match required format
  assignToCSAgent: async (
    propertyId: number,
    data: {
      cs_agent_id: number;
      priority: 'low' | 'medium' | 'high';
      due_date: string;
      assignment_type: 'verification' | 'inspection' | 'follow_up';
      notes?: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      assignment_id: number;
      property_id: number;
      cs_agent_id: number;
      status: string;
      assigned_at: string;
    };
  }> => {
    const response = await api.post(
      `/admin/properties/${propertyId}/assign-cs-agent`,
      data
    );
    return response.data;
  },

  // Bulk approve properties
  bulkApprove: async (
    property_ids: number[],
    reason?: string
  ): Promise<BulkOperationResponse> => {
    const response = await api.post<ApiResponse<BulkOperationResponse>>(
      `/admin/properties/bulk/approve`,
      {
        property_ids,
        reason: reason || 'Bulk approval after verification process completed',
      }
    );
    return response.data.data;
  },

  // Bulk reject properties
  bulkReject: async (
    property_ids: number[],
    reason: string
  ): Promise<BulkOperationResponse> => {
    const response = await api.post<ApiResponse<BulkOperationResponse>>(
      `/admin/properties/bulk/reject`,
      {
        property_ids,
        reason,
      }
    );
    return response.data.data;
  },

  // Search properties by different criteria
  searchProperties: async (
    search: string,
    type: 'title' | 'owner' | 'location' | 'id' = 'title',
    per_page: number = 20
  ): Promise<AdminProperty[]> => {
    const params = createSearchParams({
      search,
      type,
      per_page,
    });

    const response = await api.get<ApiResponse<AdminProperty[]>>(
      `/admin/properties/search?${params}`
    );
    return response.data.data;
  },

  // Get properties requiring admin attention
  getPropertiesRequiringAttention: async (): Promise<{
    pending_over_7_days: AdminProperty[];
    missing_images: AdminProperty[];
    no_owner: AdminProperty[];
    high_fraud_risk: AdminProperty[];
    count: number;
  }> => {
    const response = await api.get<ApiResponse<any>>(
      `/admin/properties/requires-attention`
    );
    return response.data.data;
  },

  // Delete property (admin force delete)
  deleteProperty: async (id: number): Promise<void> => {
    await api.delete(`/admin/properties/${id}`);
  },

  // Get CS agents for assignment - Updated to return proper agent data
  getCSAgents: async (): Promise<Agent[]> => {
    try {
      const response = await api.get<ApiResponse<Agent[]>>("/admin/cs-agents");
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching CS agents:', error);
      return [];
    }
  },
};
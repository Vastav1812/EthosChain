import axios from 'axios';

// API keys would typically be stored in environment variables
const CHARITY_NAVIGATOR_API_KEY = import.meta.env.VITE_CHARITY_NAVIGATOR_API_KEY || '';
const CHARITY_NAVIGATOR_APP_ID = import.meta.env.VITE_CHARITY_NAVIGATOR_APP_ID || '';
const GLOBAL_GIVING_API_KEY = import.meta.env.VITE_GLOBAL_GIVING_API_KEY || '';

// Define charity verification interfaces
export interface VerifiedCharityData {
  id: string;
  name: string;
  description?: string;
  mission?: string;
  category?: string;
  taxId?: string;
  verificationSource?: string;
  address?: string;
  verified: boolean;
  website?: string;
  logoUrl?: string;
  createdAt?: Date;
}

// Sample data for testing
const sampleCharities: VerifiedCharityData[] = [
  {
    id: '1',
    name: 'Global Clean Water Foundation',
    description: 'Providing clean water solutions to communities around the world.',
    mission: 'To ensure everyone has access to clean, safe drinking water.',
    category: 'Environmental, Humanitarian',
    taxId: '12-3456789',
    verificationSource: 'GuideStar',
    address: '123 Water Way, Ocean City, CA 90210',
    verified: true,
    website: 'https://globalcleanwater.org',
    logoUrl: '/charity-logos/water.svg',
  },
  {
    id: '2',
    name: 'Tech Education for All',
    description: 'Bringing technology education to underserved communities.',
    mission: 'To bridge the digital divide and create opportunity through education.',
    category: 'Education, Technology',
    taxId: '98-7654321',
    verificationSource: 'Charity Navigator',
    address: '456 Tech Blvd, Silicon Valley, CA 94025',
    verified: true,
    website: 'https://techeducationforall.org',
    logoUrl: '/charity-logos/tech.svg',
  },
  {
    id: '3',
    name: 'Wilderness Preservation Society',
    description: 'Protecting natural habitats and wildlife across the globe.',
    mission: 'To preserve wilderness areas for future generations.',
    category: 'Environmental, Conservation',
    taxId: '45-6789012',
    verificationSource: 'BBB Wise Giving Alliance',
    address: '789 Forest Road, Mountain View, CO 80401',
    verified: true,
    website: 'https://wildernesspreservation.org',
    logoUrl: '/charity-logos/forest.svg',
  }
];

/**
 * Search for charities using the Charity Navigator API
 */
export const searchCharitiesByNavigator = async (query: string): Promise<VerifiedCharityData[]> => {
  if (!CHARITY_NAVIGATOR_API_KEY || !CHARITY_NAVIGATOR_APP_ID) {
    console.warn('Charity Navigator API keys not configured');
    return [];
  }

  try {
    const response = await axios.get(
      `https://api.charitynavigator.org/v2/Organizations`, {
        params: {
          app_id: CHARITY_NAVIGATOR_APP_ID,
          app_key: CHARITY_NAVIGATOR_API_KEY,
          search: query,
          pageSize: 10
        }
      }
    );

    return response.data.map((item: any) => ({
      id: item.ein,
      name: item.charityName,
      description: item.tagLine || '',
      mission: item.mission,
      website: item.websiteURL,
      category: item.category?.categoryName,
      taxId: item.ein,
      address: `${item.mailingAddress?.streetAddress1 || ''}, ${item.mailingAddress?.city || ''}, ${item.mailingAddress?.stateOrProvince || ''}, ${item.mailingAddress?.postalCode || ''}`,
      verified: true,
      verificationSource: 'Charity Navigator'
    }));
  } catch (error) {
    console.error('Error fetching charities from Charity Navigator:', error);
    return [];
  }
};

/**
 * Search for charities using the Global Giving API
 */
export const searchCharitiesByGlobalGiving = async (query: string): Promise<VerifiedCharityData[]> => {
  if (!GLOBAL_GIVING_API_KEY) {
    console.warn('Global Giving API key not configured');
    return [];
  }

  try {
    const response = await axios.get(
      `https://api.globalgiving.org/api/public/services/search/projects`, {
        params: {
          api_key: GLOBAL_GIVING_API_KEY,
          q: query
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const projects = response.data.search.response.projects.project;
    
    return projects.map((project: any) => ({
      id: project.id,
      name: project.organization.name,
      description: project.title,
      mission: project.summary,
      website: project.organization.url,
      logoUrl: project.organization.logoUrl,
      category: project.themes?.theme[0]?.name,
      verified: true,
      verificationSource: 'Global Giving'
    }));
  } catch (error) {
    console.error('Error fetching charities from Global Giving:', error);
    return [];
  }
};

/**
 * Verify a charity by its tax ID (EIN in the US)
 */
export const verifyCharityByTaxId = async (taxId: string): Promise<VerifiedCharityData | null> => {
  if (!CHARITY_NAVIGATOR_API_KEY || !CHARITY_NAVIGATOR_APP_ID) {
    console.warn('Charity Navigator API keys not configured');
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.charitynavigator.org/v2/Organizations/${taxId}`, {
        params: {
          app_id: CHARITY_NAVIGATOR_APP_ID,
          app_key: CHARITY_NAVIGATOR_API_KEY
        }
      }
    );

    const item = response.data;
    
    return {
      id: item.ein,
      name: item.charityName,
      description: item.tagLine || '',
      mission: item.mission,
      website: item.websiteURL,
      category: item.category?.categoryName,
      taxId: item.ein,
      address: `${item.mailingAddress?.streetAddress1 || ''}, ${item.mailingAddress?.city || ''}, ${item.mailingAddress?.stateOrProvince || ''}, ${item.mailingAddress?.postalCode || ''}`,
      verified: true,
      verificationSource: 'Charity Navigator'
    };
  } catch (error) {
    console.error('Error verifying charity by tax ID:', error);
    return null;
  }
};

/**
 * Combines results from multiple charity APIs
 */
export const searchVerifiedCharities = async (query: string): Promise<VerifiedCharityData[]> => {
  // Try to get data from API endpoints first
  try {
    const [navigatorResults, globalGivingResults] = await Promise.all([
      searchCharitiesByNavigator(query),
      searchCharitiesByGlobalGiving(query)
    ]);
    
    if (navigatorResults.length > 0 || globalGivingResults.length > 0) {
      return [...navigatorResults, ...globalGivingResults];
    }
  } catch (error) {
    console.warn('API search failed, falling back to sample data', error);
  }
  
  // If API endpoints fail or return no results, fall back to sample data
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = sampleCharities.filter(charity => 
        charity.name.toLowerCase().includes(query.toLowerCase()) ||
        (charity.description && charity.description.toLowerCase().includes(query.toLowerCase())) ||
        (charity.category && charity.category.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(results);
    }, 500); // Add a slight delay to simulate network request
  });
};

/**
 * Gets charity impact data if available
 */
export const getCharityImpact = async (charityId: string, source: string): Promise<string[]> => {
  if (source === 'Global Giving' && GLOBAL_GIVING_API_KEY) {
    try {
      const response = await axios.get(
        `https://api.globalgiving.org/api/public/projectservice/projects/${charityId}/reports`, {
          params: {
            api_key: GLOBAL_GIVING_API_KEY
          },
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      const reports = response.data.reports.report || [];
      return reports.map((report: any) => report.title);
    } catch (error) {
      console.error('Error fetching charity impact data:', error);
      return [];
    }
  }
  
  return [];
};

// Get a verified charity by ID
export const getVerifiedCharityById = async (id: string): Promise<VerifiedCharityData | null> => {
  // In a real application, this would make an API call to a verification service
  return new Promise((resolve) => {
    setTimeout(() => {
      const charity = sampleCharities.find(c => c.id === id) || null;
      resolve(charity);
    }, 300);
  });
};

// Verify a charity that's not already in the system
export const verifyNewCharity = async (charityInfo: Partial<VerifiedCharityData>): Promise<VerifiedCharityData> => {
  // In a real application, this would submit the charity for verification
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCharity: VerifiedCharityData = {
        id: `new-${Date.now()}`,
        name: charityInfo.name || 'Unknown Charity',
        description: charityInfo.description || 'No description provided',
        taxId: charityInfo.taxId,
        address: charityInfo.address,
        verified: true, // In a real system, this would start as false until verified
        createdAt: new Date(),
        ...charityInfo
      };
      resolve(newCharity);
    }, 1000);
  });
}; 
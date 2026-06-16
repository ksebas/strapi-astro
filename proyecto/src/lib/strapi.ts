import qs from 'qs';
const BASE_URL = import.meta.env.STRAPI_URL;

const QUERY_HOME_PAGE= {
  populate: {
    hero: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText", "width", "height"]
            },
            link: {
              fields: ["href", "label", "isExternal"]
            }
          }
        }
      }
    }
  }
}

export async function getHomePage() {
    const query = qs.stringify(QUERY_HOME_PAGE)
    const response = await getStrapiData(`/api/home-page?${query}`);
    return response?.data;
}


export interface StrapiUser {
    id: number;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export async function getMe(jwt: string): Promise<StrapiUser | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        if (!response.ok) {
            return null;
        }
        return (await response.json()) as StrapiUser;
    } catch (error) {
        console.error('Error fetching current user from Strapi:', error);
        return null;
    }
}

export async function getStrapiData(url: string) {
    try {   
	const response = await fetch(`${BASE_URL}${url}`);
	if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
    } catch (error) {
        console.error('Error fetching data from Strapi:', error);
        throw error;
    }
}
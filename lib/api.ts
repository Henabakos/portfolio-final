// Client-side API functions using SWR
export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  });

export const apiEndpoints = {
  projects: "/api/projects",
  blog: "/api/blog",
  about: "/api/about",
  contact: "/api/contact",
  socials: "/api/socials",
  tools: "/api/tools",
  services: "/api/services",
}

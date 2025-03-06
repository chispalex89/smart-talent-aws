class ApiService {
  readonly baseUrl =
    import.meta.env.VITE_API_ || process.env.REACT_APP_API_BASE_URL;

  private toQueryString(data?: Record<string, unknown>) {
    if (!data) return '';
    const searchParams = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    return searchParams.toString();
  }

  async get<T>(path: string, data?: Record<string, unknown>) {
    const queryString = this.toQueryString(data);
    console.log(this.baseUrl);
    console.log(import.meta.env);
    console.log(process.env);
    const url = queryString
      ? `${this.baseUrl}${path}?${queryString}`
      : `${this.baseUrl}${path}`;
    return fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<T>);
  }
  async post(path: string, data: unknown) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  async put<T>(path: string, data: unknown) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json() as Promise<T>);
  }
  async patch<T>(path: string, data: unknown) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json() as Promise<T>);
  }
  async delete(path: string) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default new ApiService();

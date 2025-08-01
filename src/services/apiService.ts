class ApiService {
  readonly baseUrl =
    import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

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

  async post<T>(path: string, data: Record<string, unknown>): Promise<T>;
  async post<T>(path: string, data: FormData): Promise<T>;
  async post<T>(path: string, data: unknown) {
    if (data instanceof FormData) {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        body: data,
      });

      if (res.status > 199 && res.status < 300) {
        if (res.status === 204) {
          return {} as T;
        }
        return res.json() as Promise<T>;
      }
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status > 199 && res.status < 300) {
      if (res.status === 204) {
        return {} as T;
      }
      return res.json() as Promise<T>;
    }
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  async put<T>(path: string, data: Record<string, unknown>): Promise<T>;
  async put<T>(path: string, data: FormData): Promise<T>;
  async put<T>(path: string, data: unknown) {
    if (data instanceof FormData) {
      return fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        body: data,
      }).then((res) => res.json() as Promise<T>);
    }

    return fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json() as Promise<T>);
  }

  async patch<T>(path: string, data: Record<string, unknown>): Promise<T>;
  async patch<T>(path: string, data: FormData): Promise<T>;
  async patch<T>(path: string, data: unknown) {
    if (data instanceof FormData) {
      return fetch(`${this.baseUrl}${path}`, {
        method: 'PATCH',
        body: data,
      }).then((res) => res.json() as Promise<T>);
    }
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json() as Promise<T>);
  }
  async delete(path: string, data?: Record<string, unknown>) {
    const options: any = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return fetch(`${this.baseUrl}${path}`, options);
  }
}

export default new ApiService();

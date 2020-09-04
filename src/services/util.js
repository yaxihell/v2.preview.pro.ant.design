export const xFetch = ({ url, onSuccess }) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      credentials: 'include',
    }).then(response => {
      const clone = response.clone();
      if (clone.status >= 400 && clone.status < 500) {
        throw new Error('请求错误');
      } else if (clone.status >= 200 && clone.status < 300) {
        clone.json().then(data => {
          // eslint-disable-next-line no-unused-expressions
          onSuccess && onSuccess(data);
          resolve(data);
        });
      }
    });
  });
};

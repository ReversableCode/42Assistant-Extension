export function getHTML(url: string): Promise<Document> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "document";
    xhr.onload = function () {
      const status = xhr.status;
      if (status === 200) {
        if (xhr.response.URL === "https://signin.intra.42.fr/users/sign_in")
          reject("You are not logged in to 42 Intra");
        else resolve(xhr.response);
      } else reject(xhr.response);
    };
    xhr.send();
  });
}

export function getJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      const status = xhr.status;
      if (status === 200) resolve(xhr.response || {});
      else reject(xhr.response);
    };
    xhr.send();
  });
}

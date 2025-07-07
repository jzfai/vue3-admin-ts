function createImagePlaceholder() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL();
}

class AvatarManager {
  cache: Record<string, Promise<string> | undefined> = {};
  defaultImg = createImagePlaceholder();
  async getImage(url?: string) {
    if (!url) {
      return this.defaultImg;
    }
    const image = this.cache[url];
    if (image) {
      return image;
    }
    const p = new Promise<string>((rs, rj) => {
      fetch(url)
        .then((r) => r.blob())
        .then((b) => rs(URL.createObjectURL(b)))
        .catch((e) => {
          this.cache[url] = undefined;
          rj(e);
        });
    });
    this.cache[url] = p;
    return p;
  }
}
export default new AvatarManager();

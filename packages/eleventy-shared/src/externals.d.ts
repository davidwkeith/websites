declare module "@11ty/eleventy-img" {
  function Image(src: string, options?: any): Promise<any>;
  namespace Image {
    function generateHTML(metadata: any, attributes: any): string;
  }
  export default Image;
}

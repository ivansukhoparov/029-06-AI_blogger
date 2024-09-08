import fs from 'fs';

export const writeDownToFile = async (data: any, name: string) => {
  new Promise((resolve, reject) => {
    const body = JSON.stringify(data); //+ "," + "\n"
    fs.appendFile(`./responses/${name}`, body, (err) => {
      if (err) {
        console.error(err);
      } else {
        // done!
        console.log(`The file ${name} has been wrote`);
      }
    });
  });
};

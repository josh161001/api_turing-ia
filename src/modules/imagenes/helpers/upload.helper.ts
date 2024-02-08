// helper que modifica el nombre de la imagen
export const renameImage = (req, file, callback) => {
  const name = file.originalname.split('.')[0];

  const fileName = file.originalname;

  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${name}-${randomName}${fileName}`);
};

// helper que filtra las extensiones de archivos permitidos
export const imagenFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Solo se permiten archivos de imagen'), false);
  }

  callback(null, true);
};

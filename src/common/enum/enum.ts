// toma un objeto de enumeración y devuelve una cadena
//  con todos los valores de la enumeración separados por comas
export function enumToString(enumObject: any): string {
  return Object.keys(enumObject)
    .map((key) => enumObject[key])
    .join(', ');
}

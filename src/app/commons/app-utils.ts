import * as cloneDeep from 'lodash/cloneDeep';
export const API_HOST = 'https://gy7228.myfoscam.org:8080/rest/';
//gy7228.myfoscam.org:8080
// PARA desplegar la version en desarrollo con el proxy
export const REST_HOST = '/rest/';
export const SERVICE_REST = REST_HOST;

export const VARGLOBALRESPONSE = -1;
export const ID_ROL_ADMIN = 2;

// COLORES PARA LA NOTIFICACIÓN
export const NOTIFY = {
  PRIMARY: 6,
  ROSE: 5,
  DANGER: 4,
  WARNING: 3,
  SUCCESS: 2,
  INFO: 1
};

export function deleteEmptyData(data) {
    for (const key in data) {
        if (data[key] === '' || data[key] == null) {
          delete data[key];
        }
    }
    return data;
}
export function parseDate(data) {
  if (data != null && data !== '') {
    for (const key in data) {
      if (data[key] != null && data[key].year != null && data[key].year !== '') {
        data[key] = data[key].year + '/' + data[key].month + '/' + data[key].day;
      }
    }
  }
  return data;
}

export function makeParam(data){
  let parametros = cloneDeep(data);
  parametros = parseDate(parametros);
  parametros = deleteEmptyData(parametros);
  return parametros;
}

export function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}

export function error(arg) {
  if (arg === -1) {
    return true;
  }
  return false;
}

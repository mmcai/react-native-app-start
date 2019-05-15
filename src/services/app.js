import {request, api} from '../utils/index';

const {version_check_url} = api;

export function Version_check_url(data) {
  const url = `${version_check_url}/${data.versionNo}/${data.versionType}`;
  return request({
    url: url,
    data,
  })
}


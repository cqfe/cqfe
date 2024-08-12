import { appendFileSync } from 'fs';
import { resolvePath, resolvePathV3 } from './resolve';
import SwaggerParse from '@readme/openapi-parser';
import { isEmpty } from 'lodash';
import { initOutPutFile } from './utils';

export interface GenerateApiConfig {
  /**
   * The URL of the server to connect to.
   */
  url: string;
  /**
   * The out put js file path
   */
  outPut: string;
  /**
   * The request function path with string.
   */
  servicePath: string;
  /**
   * The jsDoc for request.
   */
  generateRequestDoc?: boolean;
  /**
   * The jsDoc for response.
   */
  generateResponseDoc?: boolean;
}

async function generateApi(config: GenerateApiConfig) {
  // init output file
  initOutPutFile(config.outPut, config.servicePath);
  // resolve paths from swagger
  const { paths = {}, openapi } = (await SwaggerParse.dereference(config.url)) as any;
  if (isEmpty(paths)) return;
  Object.keys(paths).forEach((path: string) => {
    (openapi?.charAt(0) === '3' ? resolvePathV3 : resolvePath)(
      path,
      paths[path] as any,
      config.outPut,
      config.generateRequestDoc,
    );
  });
  appendFileSync(config.outPut, '\n');
}

export default generateApi;

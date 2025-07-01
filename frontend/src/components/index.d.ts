declare module './IPDetails' {
  import { FC } from 'react';
  import { IPInfo } from '../services/api';
  
  interface IPDetailsProps {
    ipInfo: IPInfo;
  }
  
  const IPDetails: FC<IPDetailsProps>;
  export default IPDetails;
}

declare module './IPMap' {
  import { FC } from 'react';
  import { IPInfo } from '../services/api';
  
  interface IPMapProps {
    ipInfo: IPInfo;
  }
  
  const IPMap: FC<IPMapProps>;
  export default IPMap;
}

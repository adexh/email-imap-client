import { CorsOptions } from 'cors';

const allowedOrigins = ["http://localhost:5173"];

const customCorsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};

export default customCorsOptions;
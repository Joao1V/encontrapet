'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-custom.css';

export default function ApiDocsPage() {
   useEffect(() => {
      const originalError = console.error;
      const originalWarn = console.warn;

      console.error = (...args) => {
         const message = typeof args[0] === 'string' ? args[0] : '';
         if (
            message.includes('UNSAFE_componentWillReceiveProps') ||
            message.includes('componentWillReceiveProps') ||
            message.includes('unsafe-component-lifecycles')
         ) {
            return;
         }
         originalError.apply(console, args);
      };

      console.warn = (...args) => {
         const message = typeof args[0] === 'string' ? args[0] : '';
         if (
            message.includes('UNSAFE_componentWillReceiveProps') ||
            message.includes('componentWillReceiveProps') ||
            message.includes('unsafe-component-lifecycles')
         ) {
            return;
         }
         originalWarn.apply(console, args);
      };

      return () => {
         console.error = originalError;
         console.warn = originalWarn;
      };
   }, []);

   return (
      <div
         style={{ height: '100vh', width: '100%', backgroundColor: '#f5f7fa' }}
         suppressHydrationWarning
      >
         <SwaggerUI
            url="/api/openapi-merged"
            persistAuthorization={true}
            displayRequestDuration={true}
            filter={true}
            docExpansion="list"
         />
      </div>
   );
}

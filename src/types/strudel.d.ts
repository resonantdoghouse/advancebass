import * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "strudel-repl": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { code?: string },
        HTMLElement
      >;
    }
  }
}

// Fallback for global JSX namespace in older TS/React configurations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "strudel-repl": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { code?: string },
        HTMLElement
      >;
    }
  }
}

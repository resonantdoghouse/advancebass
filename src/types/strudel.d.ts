import * as React from "react";

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

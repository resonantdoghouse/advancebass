import React from 'react';

type Props = {
  data: Record<string, any> | Record<string, any>[];
};

export const JsonLd = ({ data }: Props) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

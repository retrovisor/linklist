import { getDictionary } from '@/libs/getDictionary';

export default async function LocalizedLayout({ children, params }) {
  const lang = params?.lang || 'en';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        {/* Your header component */}
        <main>{children}</main>
        {/* Your footer component */}
      </body>
    </html>
  );
}

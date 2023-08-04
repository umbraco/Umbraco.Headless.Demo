import { ImageResponse } from 'next/server';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME
    },
    ...props
  };

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-[#3544B1] text-white">
        <div tw="bg-white rounded-full w-[250px] h-[250px] flex items-center justify-center text-[#3544B1]">
          <div tw="flex -mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Logo"
              viewBox="0 0 50 56.1"
              fill="currentColor"
              shapeRendering="geometricPrecision"
              width="120"
            >
              <path d="M49.9 31.7c-.1-2.5-.3-5.1-.6-7.6-.3-2.3-.6-3.9-.9-5.5-.2-.8-.2-1.1-.3-1.5-.1-.4-.4-.7-.8-.7h-.1l-5.5.9c-.4.1-.7.4-.7.9v.1l.3 1.5c.3 1.5.6 3.5.8 5.8.3 2.4.4 4.8.4 7.3 0 4.6-.4 8.1-1.4 10.3-1 2.2-3 3.9-5.3 4.4-3.2.7-6.5 1-9.8.9h-1.8c-3.3.1-6.6-.2-9.8-.9-2.4-.5-4.4-2.1-5.4-4.4-1-2.2-1.5-5.6-1.5-10.3 0-2.4.2-4.9.5-7.3.3-2.4.6-4.3.8-5.8l.3-1.5v-.1c0-.4-.3-.8-.7-.9l-5.5-.9h-.1c-.4 0-.7.3-.8.7-.1.4-.1.6-.3 1.5-.3 1.6-.6 3.2-.9 5.5-.3 2.5-.5 5-.6 7.6C0 33.5 0 35.3.1 37c.1 4.7.9 8.4 2.4 11.2 1.6 2.9 4.3 5.1 7.5 6 3.5 1.2 8.4 1.8 14.7 1.8h.8c6.3 0 11.2-.6 14.7-1.8 3.2-1 5.9-3.1 7.5-6 1.5-2.8 2.3-6.5 2.4-11.2-.1-1.7-.1-3.5-.2-5.3z"></path>
              <path d="M14.2 12.2c.1.9.3 1.9.6 2.8.2.8.4 1.4.6 2l.1.2c.1.2.1.2.1.3.2.5.7.8 1.2.8h.2l2.1-.6c.6-.2 1-.8.9-1.4l-.2-.8c-.2-.5-.3-1.2-.5-2s-.4-1.7-.5-2.5c-.2-1.1-.2-2.3 0-3.3.2-.5.6-1 1.1-1.1 1.1-.3 2.2-.5 3.4-.6l.7-.1c1.1-.2 2.2-.2 3.4-.1.6 0 1.1.4 1.3.8.5 1 .8 2.1.9 3.3.1.8.1 1.7.2 2.5v2.8c.1.6.6 1.1 1.3 1.1l2 .1h.2c.6-.1 1.1-.6 1.1-1.1 0-.1 0-.3.1-.6 0-.6.1-1.2.1-2.1 0-.9 0-1.9-.1-2.8 0-.7-.1-1.4-.2-2-.2-1.5-.7-3-1.5-4.4-.9-1.2-2.2-2-3.6-2.2-1.9-.3-3.8-.3-5.7 0h-.2c-1.9.2-3.8.6-5.5 1.4-1.3.6-2.4 1.7-3 3.1-.5 1.5-.6 3-.4 4.5-.4.7-.3 1.4-.2 2z"></path>
            </svg>
          </div>
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Lato',
          data: await fetch(new URL('../fonts/Lato-Bold.ttf', import.meta.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: 'normal',
          weight: 700
        }
      ]
    }
  );
}

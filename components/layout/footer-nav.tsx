import { Menu } from 'lib/umbraco/types';
import Link from 'next/link';

export default async function FooterNav({ menu }: { menu?: Menu[] }) {
  if (!menu) return null;
  return (
    <nav className="inline-block text-center lg:text-left">
      <ul>
        {menu.map((x, i) => (
          <li key={i} className="py-1 text-lg leading-relaxed lg:py-0">
            <Link href={x.path} className="underline">
              {x.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

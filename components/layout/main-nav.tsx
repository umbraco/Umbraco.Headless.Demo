import { Menu } from 'lib/umbraco/types';
import Link from 'next/link';

export default function MainNav({ menu }: { menu?: Menu[] }) {
  if (!menu) return null;
  return (
    <nav className="hidden font-bold sm:mb-8 sm:flex sm:flex-row sm:justify-end ">
      {menu.map((itm, i) => (
        <Link
          key={i}
          href={itm.path}
          className="ml-8 py-0 text-xl text-umb-blue hover:text-umb-blue-dark"
        >
          {itm.title}
        </Link>
      ))}
    </nav>
  );
}

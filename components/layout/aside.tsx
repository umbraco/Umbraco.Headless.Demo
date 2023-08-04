import clsx from 'clsx';
import LogoIcon from 'components/icons/logo';
import Link from 'next/link';

import { ReactNode } from 'react';

function Aside({ 
    children,
    ...props
}: { 
    children?: ReactNode 
} & React.ComponentProps<'aside'>) {
    return (
        <aside {...props} className={clsx(
            'bg-umb-blue relative flex flex-col flex-wrap items-start justify-between w-full p-8 lg:p-14 lg:sticky lg:h-screen lg:top-0',
            props?.className) }>		
            <Link href="/" className="block relative w-10 h-10 lg:w-14 lg:h-14">
                <LogoIcon className="relative fill-white w-full h-full z-20" />
            </Link>
            <div id="sidebar-content">
                {children}
            </div>
        </aside>
    );
}

function AsideContent({ 
    children
}: { 
    children?: ReactNode 
})
{
    return <>{children}</>
}

Aside.Content = AsideContent;

export default Aside;
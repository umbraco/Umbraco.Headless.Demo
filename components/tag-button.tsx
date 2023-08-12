import clsx from 'clsx';
import { ReactNode } from 'react';

export default function TagButton({
  children,
  size,
  selected,
  disabled,
  allowDisabledClick,
  ...props
}: {
  children?: ReactNode;
  size?: 'small' | 'large';
  selected?: boolean;
  disabled?: boolean;
  allowDisabledClick?: boolean;
} & React.ComponentProps<'button'>) {
  // Set default size
  size = size || 'large';

  return (
    <button
      type="button"
      className={clsx(
        'btn flex-1 outline-umb-blue',
        {
          'btn-sm px-3': size === 'small',
          'btn-md px-4': size === 'large',
          'bg-stb-5 text-black hover:bg-stb-15': !selected && !disabled,
          'cursor-default bg-umb-green text-white': selected && !disabled,
          'bg-stb-15 text-gray-400 line-through': !selected && disabled,
          'bg-stb-40 text-white line-through': selected && disabled,
          'cursor-not-allowed': disabled && !allowDisabledClick
        },
        props.className
      )}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}

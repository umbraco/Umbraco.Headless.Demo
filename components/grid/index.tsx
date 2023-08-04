import clsx from 'clsx';

function Grid(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={clsx('grid grid-flow-row gap-8 md:grid-cols-2 min-[2000px]:grid-cols-3', props.className)}>
      {props.children}
    </div>
  );
}

function GridItem(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        'relative h-full w-full overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

Grid.Item = GridItem;

export default Grid;

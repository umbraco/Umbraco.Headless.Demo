const Price = ({
  amount,
  currencyCode = 'EUR',
  prefix,
  ...props
}: {
  amount: string;
  currencyCode: string;
  prefix?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} {...props}>
    {`${prefix || ''} ${new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(parseFloat(amount))}`}
  </p>
);

export default Price;

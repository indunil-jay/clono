interface OverviewPropertyProps {
  lable: string;
  children: React.ReactNode;
}

export const OverviewProperty = ({
  children,
  lable,
}: OverviewPropertyProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{lable}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};

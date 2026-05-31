type Props = {
    children: React.ReactNode;
};

export const StickyWrapper = ({children}: Props) => {
    return (
        <div className="hidden lg:block w-[356px] sticky self-start top-6 z-25">
            <div className="flex flex-col gap-y-4">
                {children}
            </div>
        </div>
    );
};
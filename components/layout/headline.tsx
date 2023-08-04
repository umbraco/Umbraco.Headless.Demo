export default function Headline({ 
    title,
    description
}: { 
    title?: string,
    description?: string
}) {
    return (
        <div className="text-white relative pt-20 lg:pt-0">
            <h1 className="font-bold text-4xl xl:text-5xl">{title}</h1>
            {description && <p className="mt-8">{description}</p>}
        </div>
    );
}
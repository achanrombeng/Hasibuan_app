export default function HeadingSmall({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <header>
            <h3 className="mb-0.5 font-serif text-xl font-medium text-terra-900">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-terra-500">{description}</p>
            )}
        </header>
    );
}

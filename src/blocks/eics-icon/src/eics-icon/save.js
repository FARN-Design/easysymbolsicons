const { __ } = wp.i18n;
const { useBlockProps } = wp.blockEditor;

export default function Save({ attributes }) {
	const { className, fontSize, lineHeight, backgroundColor, textColor, align } =
		attributes;

	const blockProps = useBlockProps.save({
		className: `selected-icon-wrapper align${align}`,
		style: {
			fontSize: fontSize ? `${fontSize}px` : undefined,
			lineHeight: lineHeight ? `${lineHeight}px` : undefined,
			backgroundColor: backgroundColor || undefined,
			color: textColor || undefined,
		},
	});

	const isIconValid = (iconClassName) => {
		if (!window.easySymbolsIconsLoadedFonts) return false;
		const loadedFonts = window.easySymbolsIconsLoadedFonts;

		for (const fontFolder in loadedFonts) {
			const fontGlyphs = loadedFonts[fontFolder];
			for (const glyphName in fontGlyphs) {
				const expectedClass = `eics-${fontFolder.toLowerCase()}__${glyphName}`;
				if (iconClassName === expectedClass) {
					return true;
				}
			}
		}
		return false;
	};

	return (
		<div {...blockProps}>
			{className && isIconValid(className) ? (
				<span className={className}></span>
			) : (
				<p>{__("No Icon Selected", "easy-symbols-icons")}</p>
			)}
		</div>
	);
}

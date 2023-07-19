export function getParagraphs(text: string): string[] {
	const paragraphs = text.split('\n').map((paragraph) => paragraph.trim())
	return paragraphs.filter((paragraph) => paragraph !== '')
}

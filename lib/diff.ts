
// Simple heuristic diff for text
export const computeDiff = (oldText: string, newText: string) => {
    // In a real app, use 'diff' library. Here, just return side-by-side.
    return { oldText, newText };
};

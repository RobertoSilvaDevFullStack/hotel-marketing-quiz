import { Question } from "../types";

export const exportToCSV = (
  answers: Record<string, number>,
  questions: Question[]
): void => {
  try {
    // Create CSV header
    let csv = "Question ID,Question Text,Option ID,Option Text,Vote Count\n";

    // Add data rows
    questions.forEach((question) => {
      question.options.forEach((option) => {
        const voteCount = answers[option.id] || 0;
        const row = [
          question.id,
          `"${question.question.replace(/"/g, '""')}"`, // Escape quotes
          option.id,
          `"${option.text.replace(/"/g, '""')}"`,
          voteCount,
        ].join(",");
        csv += row + "\n";
      });
    });

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `quiz_results_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    alert("Erro ao exportar relatório. Verifique o console para detalhes.");
  }
};

import { useSettings } from "@/hooks/useSettings";
import { solutionCategories, metiersData, type SolutionItem, type SolutionCategory } from "@/data/solutionsData";

export function useSolutionsData() {
  const { settings, loading } = useSettings("solutions_data");

  const categories: SolutionCategory[] = settings.solutionCategories || solutionCategories;
  const metiers = settings.metiersData || metiersData;

  const getDynamicSolutionBySlug = (slug: string): SolutionItem | undefined => {
    const metier = metiers.find((item: any) => item.slug === slug);
    if (metier) return metier as SolutionItem;

    for (const category of categories) {
      const solution = category.items.find((item: any) => item.slug === slug);
      if (solution) return solution as SolutionItem;
    }
    return undefined;
  };

  return { categories, metiers, getDynamicSolutionBySlug, loading };
}



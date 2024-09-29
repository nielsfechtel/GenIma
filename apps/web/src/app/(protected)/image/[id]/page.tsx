import { fetchImageById } from "@web/src/actions/image.actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@web/src/components/ui/card";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const imageData = await fetchImageById(params.id);

  const t = await getTranslations("image");

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        {t("image-by") + ` ${imageData.creator.firstName}`}
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={imageData.image_url}
          alt={t("image-by") + ` ${imageData.creator.firstName}`}
          width={200}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardContent>
      <CardFooter>Categories are: {imageData.categories}</CardFooter>
    </Card>
  );
}

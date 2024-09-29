import { Button } from "@web/src/components/ui/button";
import { Card, CardContent } from "@web/src/components/ui/card";
import { ImageIcon, Users, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function LandingPage() {
  const t = await getTranslations("LandingPage");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t("create-amazing-images-with-ai")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t("no-technical-knowledge-required")}
          </p>
          <Link href="/login">
            <Button size="lg">{t("get-started")}</Button>
          </Link>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {t("features")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <ImageIcon className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">
                    {t("easy-image-generation")}
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("describe-your-idea-and-watch-ai-bring-it-to-life")}
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <Zap className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">
                    {t("lightning-fast")}
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("get-your-images-in-seconds-not-hours")}
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">
                    {t("get-started")}
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("no-technical-skills-needed-perfect-for-all-creators")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("see-it-in-action")}
            </h2>
            <div className="relative h-[400px] w-full max-w-[600px] mx-auto overflow-hidden rounded-lg shadow-lg">
              {/* {slides.map((slide, index) => (
                <Image
                  key={index}
                  src={slide}
                  alt={`AI generated image ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))} */}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background py-6 text-center">
        <p className="text-muted-foreground">
          &copy; 2023 AI ImageCraft. {t("all-rights-reserved")}
        </p>
      </footer>
    </div>
  );
}

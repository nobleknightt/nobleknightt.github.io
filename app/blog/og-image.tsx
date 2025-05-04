import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

const width = 1200;
const height = 630;

const getFont = async () => {
  const fontSourcePath = path.resolve(
    "./node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf"
  );
  return await fs.readFile(fontSourcePath);
};

export async function generateOgImage(title: string, slug: string) {
  const fontData = await getFont();

  const svg = await satori(
    <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
      <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
        <h2 tw="text-4xl font-medium tracking-tight text-left text-black">
          {title}
        </h2>
      </div>
    </div>,
    {
      width,
      height,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });

  const pngBuffer = resvg.render().asPng();

  const outPath = path.join(process.cwd(), "public", "og", `${slug}.png`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, pngBuffer);
}

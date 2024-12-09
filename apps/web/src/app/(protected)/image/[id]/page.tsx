import { fetchImageById } from '@web/src/actions/image.actions'
import ImageComponent from '@web/src/app/(protected)/image/_components/ImageComponent'
import { RouterOutputs } from '@web/src/trpc'

export default async function Page({ params }: { params: { id: string } }) {
  type ImagesType = RouterOutputs['generatedImage']['getAllImages']
  const image = await fetchImageById(params.id) as ImagesType[0]

  return typeof image.creator !== 'string' ? (
    <div className="p-4">
      <ImageComponent
        enableLink={false}
        smallImageDimension={1024}
        showDeleteButton={true}
        creatorId={image.creator._id}
        firstName={image.creator.firstName}
        {...image}
        createdAt={new Date(image.createdAt)}
      />
    </div>
  ) : (
    <></>
  )
}

import { fetchImageById } from '@web/src/actions/image.actions'
import ImageComponent from '@web/src/app/(protected)/image/_components/ImageComponent'

export default async function Page({ params }: { params: { id: string } }) {
  const image = await fetchImageById(params.id)

  return (
    <div className="p-4">
      <ImageComponent
        smallImageDimension={1024}
        showDeleteButton={true}
        creatorId={image.creator._id}
        firstName={image.creator.firstName}
        {...image}
      />
    </div>
  )
}

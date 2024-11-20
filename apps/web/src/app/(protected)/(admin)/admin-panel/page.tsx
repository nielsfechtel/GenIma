import { getAllTiers, getAllUsers } from '@web/src/actions/user.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@web/src/components/ui/alert-dialog'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import { Input } from '@web/src/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@web/src/components/ui/table'
import { getTranslations } from 'next-intl/server'

export default async function AdminPanel() {
  const allUsers = await getAllUsers()
  const initialTiers = await getAllTiers()
  const t = await getTranslations('AdminPanel')

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <h1 className="font-bold text-2xl">{t('admin-panel')}</h1>
        </CardHeader>
        <CardContent>
          {t('edit-the-user-tiers-or-delete-users-from-here')}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('tiers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('token-limit')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialTiers.map((tier: any, key: number) => (
                <TableRow key={key}>
                  <TableCell>
                    <Input value={tier.name} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={tier.tokenLimit} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {t('save')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('users')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((user: any, key) => (
                <TableRow key={key}>
                  <TableCell>{`${user.firstName}${user.lastName && ' '}${
                    user.lastName
                  }`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          {t('delete-user')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('are-you-absolutely-sure')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(
                              'this-action-cannot-be-undone-this-will-permanently-delete-the-user-account-and-remove-their-data-from-our-servers'
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            {t('delete-user')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

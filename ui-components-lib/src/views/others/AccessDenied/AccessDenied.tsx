import Container from '@/components/shared/Container'
import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'

const AccessDenied = () => {
    return (
        <Container className="h-full">
            <div className="h-full flex flex-col items-center justify-center">
                <SpaceSignBoard height={280} width={280} />
                <div className="mt-10 text-center">
                    <h3 className="mb-2">¡Acceso Denegado!</h3>
                    <p className="text-base">
                        No tienes permitido acceder a esta página.
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default AccessDenied

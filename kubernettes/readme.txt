INSTALACION DE JENKINS

Crear en namespace devops-tools (si no está creado aún)
kubectl create namespace devops-tools

kubectl create -f jenkins-deployment.yaml --namespace devops-tools

kubectl create -f jenkins-service.yaml --namespace devops-tools

kubectl get pod -n devops-tools
	NAME                                  READY   STATUS              RESTARTS   AGE
	jenkins-deployment-794699f9bc-gcjpm   0/1     ContainerCreating   0          18s


http://localhost:30000/


kubectl logs jenkins-deployment-794699f9bc-gcjpm --namespace devops-tools

	Jenkins initial setup is required. An admin user has been created and a password generated.
	Please use the following password to proceed to installation:

	63042f1e49b343338acf22f6f0445e11

	This may also be found at: /var/jenkins_home/secrets/initialAdminPassword


user: jberjano
pass: s*****y69

Token para acceder a GitHub desde Jenkins: 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


INSTALACION DE KUBERNETTES DASHBOARD

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml

Para habilitar el acceso:
kubectl proxy

Para acceder:
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

(pide el token)

Crear usuario:
kubectl apply -f dashboard-adminuser.yaml

Obtener el token
kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"

	eyJhbGciOiJSUzI1NiIsImtpZCI6IklkTVp3dGYyZk5sLW1uNl9Ec3hSbV9YRFhEaXZSdXJJS0FfV3ZTeDgtVDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWJ2N2hoIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI3MmY4Yjk0My1lMWY3LTRkMDUtYTJiYi1kNjRmYjhlNWRlNDEiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.MUcnfGVDwSMwn2WTomfklcK3h-OW8Y6x4lcGDLOSfEqLAH2H-UfudnQAHvp8oVZ26g8_twOxc94pbCK2q4s3S_jUXkCqATJoY7SMXfHKcDDSwOJccpQb0b2CkuBjAWJavoA6hhBSvBwvkWPVWtAYmXHGsKTYMy18wONmOju3rUkoE4RNuVTtSZyzJmtJiSRPipm--wgHRZQfMYgkSr6pNASxQqFlAeIOW8wy4LUxm-bVCPxdaypTBuDtMVqr2r4lbXcp64NjdFqxVawELV7Ii9bO5uN7-SK2Cnrjg30jc8aKKLa-VT7tNBRdd5xrjP33VkmC8N3l73sxhdMIihl5_A

INSTALACION DE NEXUS

Crear en namespace devops-tools (si no está creado aún)
kubectl create namespace devops-tools

kubectl create -f nexus-deployment.yaml

kubectl create -f nexus-service.yaml

Para acceder a Nexus:
http://localhost:32000

Para ver la contraseña de administrador: (admin)
kubectl exec -it --namespace devops-tools nexus-55976bf6fd-f9bn8 -- bash
cat /nexus-data/admin.password

	09662321-82b9-4a2e-a622-384898b3331d

Se cambia a:
usr: admin
pass: s*****y69

Se crea usuario para Jenkins:
usr: jenkins-user
pass: s*****y69
# ⚠️ Problème avec l'API XRPLF Data

## Date de découverte

12 novembre 2025

## Problème

L'API `data.xrplf.org` ne fonctionne plus correctement :

- Retourne des pages nginx par défaut
- Toutes les routes `/v1/iou/market_data/` retournent 404
- Le service semble avoir été désactivé ou déplacé

## URLs testées (toutes en échec)

```
https://data.xrplf.org/v1/iou/market_data/XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000?interval=1d
https://data.xrplf.org/v1/iou/market_data/rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP?interval=1d
```

## Impact

- ❌ Les graphiques de chandelles ne peuvent pas charger de données historiques
- ❌ Aucune paire de trading n'affiche de graphique
- ✅ L'Order Book fonctionne toujours (utilise wss://xrplcluster.com)
- ✅ Les transactions en temps réel fonctionnent

## Solutions temporaires implémentées

1. Message d'erreur informatif pour l'utilisateur
2. Logging détaillé dans la console
3. Redirection vers l'Order Book pour les prix en temps réel

## Solutions permanentes à explorer

### Option 1 : API Bithomp

```
https://bithomp.com/api/
```

- API alternative pour les données XRPL
- Nécessite investigation

### Option 2 : Construire les chandelles depuis les transactions

Utiliser `xrpl.js` pour :

1. Se connecter à `wss://xrplcluster.com`
2. Récupérer les transactions du ledger
3. Agréger les données pour créer des chandelles
4. Mise en cache côté serveur

### Option 3 : API backend personnalisée

Créer un backend Node.js qui :

1. Collecte les données du ledger XRPL
2. Stocke dans une base de données
3. Sert via une API REST
4. Mise à jour automatique

## Serveurs XRPL disponibles (pour le Order Book)

```
wss://xrplcluster.com/  ✅ (actuellement utilisé)
wss://xrpl.ws/          ✅
wss://s1.ripple.com/    ✅
wss://s2.ripple.com/    ✅ (full history)
```

## Actions nécessaires

- [ ] Rechercher documentation officielle XRPL pour API de données historiques
- [ ] Tester API Bithomp
- [ ] Implémenter solution de construction de chandelles depuis ledger
- [ ] Ajouter système de cache pour les données
- [ ] Informer les utilisateurs sur la page

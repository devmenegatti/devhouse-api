
class HouseController{
    async store(req, res){
        return res.json({message: true})
    }
}

export default new HouseController();
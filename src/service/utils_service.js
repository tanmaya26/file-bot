
function split_command(command){
    return command.split(" ");
}

function get_file_extension(filename){
    return filename.split('.').pop(); 
}

module.exports.split_command = split_command;
module.exports.get_file_extension = get_file_extension;